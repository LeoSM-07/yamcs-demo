import * as Processor from "./types/processor";

export class ProcessorClient {
  _base_url: string;

  constructor(address: string, instance: string, processor: string) {
    this._base_url = `http://${address}/yamcs/api/processors/${instance}/${processor}`;
  }

  async issue_command(
    command: string,
    options?: Processor.IssueCommandRequest,
  ) {
    try {
      const response = await fetch(`${this._base_url}/commands/${command}`, {
        method: "POST",
        body: JSON.stringify(options),
      });

      console.log("Body", JSON.stringify(options));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Processor.IssueCommandResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error listing commands:", error);
      throw error;
    }
  }
}
