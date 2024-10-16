import {
  Check,
  ChevronsUpDown,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Rocket,
  ShoppingCart,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <a href="/" className="flex items-center gap-2 font-semibold">
              <Rocket className="h-6 w-6" />
              <span className="">YAMCS Demo</span>
            </a>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Products
              </a>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <a
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </a>
                <a
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </a>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative"></div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">
              Mission Database
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GraphCard />
            <CommandsCard />
            <ParametersCard />
          </div>
        </main>
      </div>
    </div>
  );
}

export function GraphCard() {
  const list_parameters = useMemo(() => mdb.list_parameters.bind(mdb), []);
  const { data, error, isLoading } = useQuery({
    queryKey: ["paramaters"],
    queryFn: list_parameters,
  });

  const [samples, setSamples] = useState<Sample[] | undefined>();
  const [selectedParameter, setSelectedParameter] = useState<string>("");

  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <Card className="h-min col-span-2">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Parameter Viewer</CardTitle>
          <CardDescription>All available commands</CardDescription>
        </div>
        {data && (
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
        {isLoading && <div>Loading...</div>}
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
        {isLoading && <div>Loading...</div>}
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
  const list_parameters = useMemo(() => mdb.list_parameters.bind(mdb), []);

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
        {isLoading && <div>Loading...</div>}
        {error && <div>Error fetching commands: {error.message}</div>}
        {data && (
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
