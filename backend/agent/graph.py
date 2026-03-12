"""LangGraph agent — stateful graph with LLM and tool-calling loop."""

from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import MessagesState
from langgraph.prebuilt import ToolNode
from config import get_settings
from agent.tools import ALL_TOOLS


SYSTEM_PROMPT = """You are the JSO Agency Trust & Transparency Agent — an AI assistant that helps
job seekers, employers, and platform administrators evaluate recruitment agency trustworthiness
on the JSO (Job Seekers Overseas) platform.

Your capabilities:
- Search and filter agencies by name, industry, trust score, or location
- Provide detailed trust score breakdowns for any agency
- Compare multiple agencies side by side
- Generate platform-wide admin reports and statistics
- Detect anomalies like declining scores, fake reviews, or compliance violations
- Explain how the trust algorithm works transparently

Guidelines:
- Always use your tools to fetch real data before answering — never make up numbers
- Be transparent about how scores are computed
- When comparing agencies, highlight key differences and provide a recommendation
- Flag any concerns or anomalies you notice
- Be concise but thorough. Use bullet points for readability
- If asked about something outside your scope, politely redirect to agency trust topics
- Respond in a professional, helpful tone"""


def _get_llm():
    """Pick the best available LLM based on configured API keys."""
    settings = get_settings()

    if settings.groq_api_key:
        from langchain_groq import ChatGroq
        return ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=settings.groq_api_key,
            temperature=0.3,
        ), "groq/llama-3.3-70b-versatile"

    if settings.gemini_api_key:
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            google_api_key=settings.gemini_api_key,
            temperature=0.3,
        ), "gemini-2.0-flash"

    raise RuntimeError("No LLM API key configured. Set GROQ_API_KEY or GEMINI_API_KEY in .env")


def build_agent():
    """Build and return the LangGraph agent."""
    llm, model_name = _get_llm()
    global _model_name
    _model_name = model_name

    llm_with_tools = llm.bind_tools(ALL_TOOLS)
    tool_node = ToolNode(ALL_TOOLS)

    def should_continue(state: MessagesState) -> str:
        """Route: if the last message has tool calls, go to tools. Otherwise, end."""
        last = state["messages"][-1]
        if hasattr(last, "tool_calls") and last.tool_calls:
            return "tools"
        return END

    def call_model(state: MessagesState) -> dict:
        """Invoke the LLM with the current message history."""
        messages = state["messages"]
        # Ensure system prompt is first
        if not messages or not isinstance(messages[0], SystemMessage):
            messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
        response = llm_with_tools.invoke(messages)
        return {"messages": [response]}

    # Build the graph
    graph = StateGraph(MessagesState)
    graph.add_node("agent", call_model)
    graph.add_node("tools", tool_node)

    graph.add_edge(START, "agent")
    graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
    graph.add_edge("tools", "agent")  # After tool execution, go back to agent

    return graph.compile()


# Singleton agent instance
_agent = None
_model_name = "unknown"


def get_agent():
    global _agent
    if _agent is None:
        _agent = build_agent()
    return _agent


def get_model_name() -> str:
    get_agent()  # ensure built
    return _model_name


async def run_agent(query: str) -> tuple[str, list[str]]:
    """Run the agent with a user query. Returns (response_text, tools_used)."""
    agent = get_agent()

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=query),
    ]

    result = agent.invoke({"messages": messages})
    final_messages = result["messages"]

    # Extract the final AI response
    response_text = final_messages[-1].content if final_messages else "I couldn't process that request."

    # Collect which tools were called
    tools_used = []
    for msg in final_messages:
        if hasattr(msg, "tool_calls") and msg.tool_calls:
            for tc in msg.tool_calls:
                tools_used.append(tc["name"])

    return response_text, tools_used
