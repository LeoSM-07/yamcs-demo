import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { yamcs } from "@/lib/yamcs/yamcs";
import { useMemo, useState } from "react";
import { Sample } from "@/lib/yamcs/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { SampleChart } from "./dashboard/SampleChart";

const mdb = yamcs.get_mdb("gs_backend");

export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.";

export function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraphCard />
        <CommandsCard />
        <ParametersCard />
      </div>
    </>
  );
}

async function list_parameters() {
  return await mdb.list_parameters();
}
export function GraphCard() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["paramaters"],
    queryFn: list_parameters,
  });

  const [samples, setSamples] = useState<Sample[] | undefined>();
  const [selectedParameter, setSelectedParameter] = useState<string>("");

  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <Card className="h-min lg:col-span-2">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Parameter Viewer</CardTitle>
          <CardDescription>All available commands</CardDescription>
        </div>
        {data?.parameters && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={selectorOpen}
                className=" justify-between"
              >
                {selectedParameter
                  ? data.parameters.find(
                      (parameter) =>
                        parameter.qualifiedName === selectedParameter,
                    )?.qualifiedName
                  : "Select parameter..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[500px] p-0">
              <Command>
                <CommandInput placeholder="Search parameter..." />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {data.parameters.map((parameter) => (
                      <CommandItem
                        key={parameter.qualifiedName}
                        value={parameter.qualifiedName}
                        onSelect={async (currentValue) => {
                          setSelectedParameter(
                            currentValue === selectedParameter
                              ? ""
                              : currentValue,
                          );
                          setSelectorOpen(false);
                          const samples = await yamcs
                            .get_archive("gs_backend")
                            .sample_parameter_values(currentValue);
                          setSamples(samples.sample);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedParameter === parameter.qualifiedName
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {parameter.qualifiedName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </CardHeader>
      <CardContent>
        {isLoading && !data && <div>Loading...</div>}
        {error && <div>Error fetching commands: {error.message}</div>}
        {samples ? (
          <SampleChart samples={samples} />
        ) : (
          <div className="h-[500px] flex justify-center items-center">
            <div className="text-xl text-muted-foreground">
              Select a Parameter to Get Started
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CommandsCard() {
  const list_commands = useMemo(() => mdb.list_commands.bind(mdb), []);

  const { data, error, isLoading } = useQuery({
    queryKey: ["list_commands"],
    queryFn: list_commands,
  });

  return (
    <Card className="h-min">
      <CardHeader>
        <CardTitle>Commands</CardTitle>
        <CardDescription>All available commands</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && !data && <div>Loading...</div>}
        {error && <div>Error fetching commands: {error.message}</div>}
        {data && (
          <ul>
            {data.commands.map((command) => (
              <li
                className="border-border border-b py-2 font-mono last:border-b-0 flex w-full justify-between"
                key={command.qualifiedName}
              >
                <span>{command.qualifiedName}</span>
                <span className="text-muted-foreground">
                  {command.significance !== undefined &&
                    command.significance.consequenceLevel}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function ParametersCard() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["paramaters"],
    queryFn: list_parameters,
  });

  return (
    <Card className="overflow-clip">
      <CardHeader>
        <CardTitle>Parameters</CardTitle>
        <CardDescription>All available parameters</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && !data && <div>Loading...</div>}
        {error && <div>Error fetching commands: {error.message}</div>}
        {data?.parameters && (
          <ul>
            {data.parameters.map((parameter) => (
              <li
                className="border-border border-b py-2 font-mono last:border-b-0 flex w-full justify-between"
                key={parameter.qualifiedName}
              >
                <span>{parameter.qualifiedName}</span>
                <span className="text-muted-foreground">
                  {parameter.type.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
