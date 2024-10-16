import { CommandInfo, ListCommandsResponse, TimeSeries } from "./types/types";

/**
 * Client for accessing core Yamcs resources.
 *
 * @param address - The The address of Yamcs in the format ‘hostname:port’
 */
class YAMCSClient {
  private _address: string;

  constructor(address: string) {
    this._address = address;
    console.log("Created Client with URL: " + this._address);
  }

  /**
   * Return an object for working with the MDB of the specified instance.
   * @param instance - A Yamcs instance name
   */
  get_mdb(instance: string): MDBClient {
    return new MDBClient(this._address, instance);
  }

  get_archive(instance: string): ArchiveClient {
    return new ArchiveClient(this._address, instance);
  }
}

class ArchiveClient {
  private _address: string;
  private _instance: string;

  constructor(address: string, instance: string) {
    this._address = address;
    this._instance = instance;
  }

  async sample_parameter_values(
    parameter: string,
    start?: Date,
    stop?: Date,
    sample_count: number = 500,
    parameter_cache: string = "realtime",
    source: string = "ParameterArchive",
  ) {
    const baseUrl = `http://${this._address}/yamcs/api/archive/${this._instance}/parameters/${parameter}/samples`;

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

      const data: TimeSeries = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch parameter samples:", error);
      throw error;
    }
  }
}

class MDBClient {
  private _address: string;
  private _instance: string;

  constructor(address: string, instance: string) {
    this._address = address;
    this._instance = instance;
  }

  async list_commands() {
    try {
      const response = await fetch(
        `http://${this._address}/yamcs/api/mdb/${this._instance}/commands`,
      );

      console.log(`http://${this._address}/api/mdb/${this._instance}/commands`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ListCommandsResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error listing commands:", error);
      throw error; // Propagate error to the caller
    }
  }

  /**
   * Gets a single command by its unique name.
   *
   * @param name - Either a fully-qualified XTCE name or an alias in the format `NAMESPACE/NAME`.
   */
  async get_command(name: string) {
    try {
      const response = await fetch(
        `http://${this._address}/yamcs/api/mdb/${this._instance}/commands/${name}`,
      );

      console.log(`http://${this._address}/api/mdb/${this._instance}/commands`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CommandInfo = await response.json();
      return data;
    } catch (error) {
      console.error("Error listing commands:", error);
      throw error; // Propagate error to the caller
    }
  }
}

export const yamcs = new YAMCSClient("localhost:8090");
