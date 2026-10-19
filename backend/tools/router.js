import { toolRegistry } from "./registry.js";

export function getToolDefinitions() {
  return Object.values(toolRegistry).map(
    (tool) => tool.definition
  );
}

export async function executeTool(
  toolName,
  args = {}
) {
  const tool = toolRegistry[toolName];

  if (!tool) {
    return {
      success: false,
      error: `Tool not found: ${toolName}`
    };
  }

  try {
    return await tool.execute(args);
  } catch (err) {
    return {
      success: false,
      error:
        err?.message ||
        `Tool execution failed: ${toolName}`
    };
  }
}