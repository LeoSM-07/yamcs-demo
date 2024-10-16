import "./App.css";
import { Button } from "@/components/ui/button";
// import { Button } from "./components/ui/button";
import { yamcs } from "./lib/yamcs/yamcs";
import { useState } from "react";
import {
  CommandInfo,
  ListCommandsResponse,
  TimeSeries,
} from "./lib/yamcs/types/types";
import { SampleChart } from "./components/dashboard/SampleChart";

function App() {
  const archive = yamcs.get_archive("gs_backend");
  const mdb = yamcs.get_mdb("gs_backend");
  const [commands, setCommands] = useState<ListCommandsResponse | undefined>();
  const [selectedCommand, setSelectedCommand] = useState<
    CommandInfo | undefined
  >();

  const [samples, setSamples] = useState<TimeSeries | undefined>();
  return (
    <div>
      <Button
        onClick={async () => {
          const commands = await mdb.list_commands();
          console.log(commands);
          setCommands(commands);
        }}
      >
        Get Commands
      </Button>
      <ul>
        {commands?.commands.map((command) => (
          <li key={command.qualifiedName}>
            <Button
              variant="link"
              onClick={async () => {
                const selectedCommand = await mdb.get_command(
                  command.qualifiedName,
                );
                setSelectedCommand(selectedCommand);
              }}
            >
              {command.qualifiedName}
            </Button>
          </li>
        ))}
      </ul>
      {selectedCommand && (
        <div>
          <h2>{selectedCommand.qualifiedName}</h2>
          <pre>{JSON.stringify(selectedCommand, undefined, 2)}</pre>
        </div>
      )}
      <div>
        <Button
          onClick={async () => {
            const samples = await archive.sample_parameter_values(
              "/FC1/FlightComputer/Battery_Voltage",
            );
            setSamples(samples);
          }}
        >
          Get Samples
        </Button>
        {samples && (
          <div>
            <SampleChart samples={samples.sample} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
