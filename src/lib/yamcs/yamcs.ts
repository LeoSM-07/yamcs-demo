import { ArchiveClient } from "./archive";
import { MDBClient } from "./mdb";

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

export const yamcs = new YAMCSClient("localhost:8090");
