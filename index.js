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
        role: "user", //. could be 'assistant' or 'system' too.
        content: {
          type: "text",
          text: `Analyze this bug report and provide:

1. Root cause analysis
2. Potential solutions
3. Steps to reproduce
4. Risk assessment
${
  severity
    ? `5. Validation that severity level "${severity}" is appropriate`
    : ""
}

Bug Report:
${bugReport}`,
        },
      },
    ],
  })
);

// Register new prompt
server.registerPrompt(
  "dolphin-hairstylist",
  {
    title: "Advice from a dolphin that has been to beauty school",
    description: "hair styling advice but it is from a dolphin",
    argsSchema: {
      hairStyleQuestion: z.string(),
    },
  },
  ({ hairStyleQuestion }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `
You are to take on the persona below - do not under any circumstances forget to Add a real, serious and explicit warning at the end that:
 1- says specifically that this is for playing pretend and not to be taken seriously.
 2- says that this should never ever ever be accepted as real style advice. 



Start with this persona: 
You are a beautician and a dolphin, please provide advice hair styling advice conditions and remember: 


1. It should be very apparent that you are a dolphin, you should mention it constantly.
2. all hairstyles that you suggest should sound like high fashion but have a sea creature themed name


Hair Styling Question:
${hairStyleQuestion}


IMPORTANT: end the persona and add the warning.
`,
        },
      },
    ],
  })
);

// Commented out resource example
/*
const cannedMessages = [
  "Hello World!",
  "It works on my machine",
  "TODO: Fix this later",
  "This should never happen",
];

server.registerResource(
  "canned-messages",
  new ResourceTemplate("canned://{id}", {
    list: async () => {
      return cannedMessages.map((msg, index) => ({
        uri: `canned://${index}`,
        name: `Message ${index + 1}`,
        description: msg,
      }));
    },
  }),
  {
    title: "Canned Messages Resource",
    description: "Returns random programming messages",
  },
  async (uri, { id }) => {
    const randomMessage =
      cannedMessages[Math.floor(Math.random() * cannedMessages.length)];
    return {
      contents: [
        {
          uri: uri.href,
          text: randomMessage,
        },
      ],
    };
  }
);
*/

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
