import * as Archive from "./types/archive";

export class ArchiveClient {
  _base_url: string;

  constructor(address: string, instance: string) {
    this._base_url = `http://${address}/yamcs/api/archive/${instance}`;
  }

  async list_command_history(
    command?: string,
    queue?: string,
    start?: Date,
    stop?: Date,
    pageSize: number = 500,
    descending: boolean = false,
  ) {
    const baseUrl = `${this._base_url}/commands`;

    const queryParams: Record<string, string> = {
      const: pageSize.toString(),
      descending: descending.toString(),
    };

    if (start) {
      queryParams["start"] = start.toISOString();
    }

    if (stop) {
      queryParams["stop"] = stop.toISOString();
    }

    if (queue) {
      queryParams["queue"] = queue;
    }

    if (command) {
      queryParams["q"] = command;
    }

    const queryString = new URLSearchParams(queryParams).toString();

    try {
      const response = await fetch(`${baseUrl}?${queryString}`);
      if (!response.ok) {
        throw new Error(
          `Error fetching command history: ${response.statusText}`,
        );
      }

      const data: Archive.ListCommandsResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch command history:", error);
      throw error;
    }
  }

  async sample_parameter_values(
    parameter: string,
    start?: Date,
    stop?: Date,
    sample_count: number = 500,
    parameter_cache: string = "realtime",
    source: string = "ParameterArchive",
  ) {
    const baseUrl = `${this._base_url}/parameters/${parameter}/samples`;

    const queryParams: Record<string, string> = {
      count: sample_count.toString(),
      processor: parameter_cache,
      source: source,
    };

    if (start) {
      queryParams["start"] = start.toISOString();
    }

    if (stop) {
      queryParams["stop"] = stop.toISOString();
    }

    const queryString = new URLSearchParams(queryParams).toString();

    try {
      const response = await fetch(`${baseUrl}?${queryString}`);
      if (!response.ok) {
        throw new Error(
          `Error fetching parameter samples: ${response.statusText}`,
        );
      }

      const data: Archive.TimeSeries = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch parameter samples:", error);
      throw error;
    }
  }
}
