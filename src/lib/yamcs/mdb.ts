import * as MDB from "@/lib/yamcs/types/mdb";

export class MDBClient {
  _base_url: string;

  constructor(address: string, instance: string) {
    this._base_url = `http://${address}/yamcs/api/mdb/${instance}`;
  }

  async get_database() {
    try {
      const response = await fetch(this._base_url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MDB.MissionDatabase = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting Mission Database:", error);
      throw error;
    }
  }

  async list_commands() {
    try {
      const response = await fetch(`${this._base_url}/commands`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MDB.ListCommandsResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error listing commands:", error);
      throw error;
    }
  }

  async list_parameters() {
    try {
      const response = await fetch(`${this._base_url}/parameters`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MDB.ListParametersResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error listing commands:", error);
      throw error;
    }
  }

  /**
   * Gets a single command by its unique name.
   *
   * @param name - Either a fully-qualified XTCE name or an alias in the format `NAMESPACE/NAME`.
   */
  async get_command(name: string) {
    try {
      const response = await fetch(`${this._base_url}/commands/${name}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MDB.CommandInfo = await response.json();
      return data;
    } catch (error) {
      console.error("Error listing commands:", error);
      throw error;
    }
  }
}
