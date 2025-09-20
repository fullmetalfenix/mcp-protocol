import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0",
});

// Register tools
server.registerTool(
  "add",
  {
    title: "Addition Tool",
    description: "Add two numbers",
    inputSchema: { a: z.number(), b: z.number() },
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(`${a} + ${b} Hello world!`) }],
  })
);

server.registerTool(
  "echo",
  {
    title: "Echo Tool",
    description: "Echoes back the provided message",
    inputSchema: { message: z.string() },
  },
  async ({ message }) => ({
    content: [{ type: "text", text: `Tool echo: ${message}` }],
  })
);

// Register prompts
server.registerPrompt(
  "analyze-bug",
  {
    title: "Bug Report Analyzer",
    description: "Creates structured prompts for analyzing bug reports",
    argsSchema: {
      bugReport: z.string(),
      severity: z.enum(["low", "medium", "high", "critical"]).optional(),
    },
  },
  ({ bugReport, severity }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Analyze this bug report and provide:

1. Root cause analysis
2. Potential solutions
3. Steps to reproduce
4. Risk assessment
${severity ? `5. Validation that severity level "${severity}" is appropriate` : ""}

Bug Report:
${bugReport}`,
        },
      },
    ],
  })
);



// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);