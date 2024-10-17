import { yamcs } from "@/lib/yamcs/yamcs";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, X } from "lucide-react";
import { useState } from "react";
import { CommandHistoryEntry } from "@/lib/yamcs/types/archive";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const archive = yamcs.get_archive("gs_backend");

async function command_history() {
  return await archive.list_command_history(
    undefined,
    undefined,
    undefined,
    undefined,
    3,
  );
}

export function Commanding() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["paramaters"],
    queryFn: command_history,
  });

  const [selectedCommand, setSelectedCommand] = useState<
    CommandHistoryEntry | undefined
  >();

  return (
    <div>
      {isLoading && !data && <div>Loading..</div>}
      {error && <div>{JSON.stringify(error)}</div>}
      {data?.entry && (
        <div
          className={cn(
            "grid gap-6",
            selectedCommand ? "grid-cols-[3fr_1fr]" : "",
          )}
        >
          <div className="col-span-full flex flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Commands
              </h2>
              <span className="text-sm text-muted-foreground">
                View previous commands and issue new ones
              </span>
            </div>

            <Button variant="default">Issue Command</Button>
          </div>
          <Table className="rounded-md overflow-clip">
            <TableHeader>
              <TableRow className="bg-[#FAFBFC] dark:bg-[#0D1525]">
                <TableHead className="">ID</TableHead>
                <TableHead>Time</TableHead>
                {!selectedCommand && <TableHead></TableHead>}
                <TableHead>Command</TableHead>
                <TableHead className="w-[50px] text-center">Q</TableHead>
                <TableHead className="w-[50px] text-center">R</TableHead>
                <TableHead className="w-[50px] text-center">S</TableHead>
                <TableHead className="w-[50px] text-center">Acks</TableHead>
                <TableHead className="w-[50px] text-center">
                  Completion
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="font-mono">
              {data.entry.map((command) => (
                <TableRow
                  key={command.id}
                  className={cn(
                    "cursor-pointer text-xs",
                    command.id === selectedCommand?.id
                      ? "bg-[#FAFBFC] dark:bg-[#0D1525]"
                      : "",
                  )}
                  onClick={() => {
                    setSelectedCommand(command);
                  }}
                >
                  <TableCell>{command.id}</TableCell>
                  <TableCell>{command.generationTime}</TableCell>
                  {!selectedCommand && (
                    <TableCell className="text-center">
                      {formatDistanceToNow(new Date(command.generationTime), {
                        addSuffix: true,
                        includeSeconds: true,
                      }).replace("about ", "~")}
                    </TableCell>
                  )}
                  <TableCell>{command.commandName}</TableCell>
                  <TableCell className="text-center">
                    {command.attr.find(
                      (a) => a.name === "Acknowledge_Queued_Status",
                    )?.value.stringValue === "OK" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {command.attr.find(
                      (a) => a.name === "Acknowledge_Released_Status",
                    )?.value.stringValue === "OK" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {command.attr.find(
                      (a) => a.name === "Acknowledge_Sent_Status",
                    )?.value.stringValue === "OK" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {selectedCommand && (
            <TooltipProvider>
              <Card className="bg-[#FAFBFC] dark:bg-[#0D1525]">
                <CardContent className="flex flex-col gap-6 pt-6">
                  <div className="flex flex-row justify-between items-center">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">
                      Command Detail
                    </h3>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={() => setSelectedCommand(undefined)}
                    >
                      <X className="w-4 h-4"></X>
                    </Button>
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>ID</Label>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger
                        onClick={() => {
                          navigator.clipboard.writeText(selectedCommand.id);
                        }}
                        className="cursor-pointer font-mono text-xs border-border border p-2 rounded-sm text-left"
                      >
                        {selectedCommand.id}
                      </TooltipTrigger>
                      <TooltipContent>Copy to Clipboard</TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Command</Label>
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() => {
                          navigator.clipboard.writeText(
                            selectedCommand.commandName,
                          );
                        }}
                        className="cursor-pointer font-mono text-xs border-border border p-2 rounded-sm text-left"
                      >
                        {selectedCommand.commandName}
                      </TooltipTrigger>
                      <TooltipContent>Copy to Clipboard</TooltipContent>
                    </Tooltip>
                  </div>
                  {(() => {
                    const binary = selectedCommand.attr.find(
                      (a) => a.name === "unprocessedBinary",
                    );
                    if (binary) {
                      const decimal = base64ToBinary(binary.value.binaryValue);
                      return (
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label>Unprocessed Binary</Label>
                          <Tooltip>
                            <TooltipTrigger
                              onClick={() => {
                                navigator.clipboard.writeText(decimal);
                              }}
                              className="cursor-pointer font-mono text-xs border-border border p-2 rounded-sm text-left"
                            >
                              {decimal}
                            </TooltipTrigger>
                            <TooltipContent>Copy to Clipboard</TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    }
                  })()}
                  {(() => {
                    const binary = selectedCommand.attr.find(
                      (a) => a.name === "binary",
                    );
                    if (binary) {
                      const decimal = base64ToBinary(binary.value.binaryValue);
                      return (
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label>Processed Binary</Label>
                          <Tooltip>
                            <TooltipTrigger
                              onClick={() => {
                                navigator.clipboard.writeText(decimal);
                              }}
                              className="cursor-pointer font-mono text-xs border-border border p-2 rounded-sm text-left"
                            >
                              {decimal}
                            </TooltipTrigger>
                            <TooltipContent>Copy to Clipboard</TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    }
                  })()}

                  <Separator />

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Generation Time</Label>
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() => {
                          navigator.clipboard.writeText(
                            selectedCommand.generationTime,
                          );
                        }}
                        className="cursor-pointer font-mono text-xs border-border border p-2 rounded-sm text-left"
                      >
                        {selectedCommand.generationTime}
                      </TooltipTrigger>
                      <TooltipContent>Copy to Clipboard</TooltipContent>
                    </Tooltip>
                  </div>
                  {(() => {
                    const username = selectedCommand.attr.find(
                      (a) => a.name === "username",
                    );
                    if (username) {
                      return (
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label>Issuer</Label>
                          <Tooltip>
                            <TooltipTrigger
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  username.value.stringValue,
                                );
                              }}
                              className="cursor-pointer font-mono text-xs border-border border p-2 rounded-sm text-left"
                            >
                              {username.value.stringValue}@
                              {selectedCommand.origin}
                            </TooltipTrigger>
                            <TooltipContent>Copy to Clipboard</TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    }
                  })()}
                  {(() => {
                    const queue = selectedCommand.attr.find(
                      (a) => a.name === "queue",
                    );
                    if (queue) {
                      return (
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label>Queue</Label>
                          <Tooltip>
                            <TooltipTrigger
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  queue.value.stringValue,
                                );
                              }}
                              className="cursor-pointer font-mono text-xs border-border border p-2 rounded-sm text-left"
                            >
                              {queue.value.stringValue}
                            </TooltipTrigger>
                            <TooltipContent>Copy to Clipboard</TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    }
                  })()}

                  <Separator />

                  {(() => {
                    const acks = selectedCommand.attr.filter(
                      (a) =>
                        a.name.startsWith("Acknowledge_") &&
                        a.value.type === "STRING",
                    );

                    return (
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label>YAMCS Acknowledgments</Label>
                        <ul className="space-y-2 mt-2">
                          {acks.map((ack) => (
                            <li className="grid gap-2 items-center grid-cols-[0.75rem_1fr_1fr_1fr] text-xs font-mono">
                              {ack.value.stringValue === "OK" ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <span>-</span>
                              )}
                              <span className="w-full">
                                {ack.name.split("_")[1]}
                              </span>
                              <span className="text-center">
                                {ack.value.stringValue}
                              </span>
                              {selectedCommand.attr.find(
                                (a) =>
                                  a.name ===
                                  `Acknowledge_${ack.name.split("_")[1]}_Time`,
                              ) && (
                                <Tooltip>
                                  <TooltipTrigger
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        new Date(
                                          parseInt(
                                            selectedCommand.attr.filter(
                                              (a) =>
                                                a.name ===
                                                `Acknowledge_${ack.name.split("_")[1]}_Time`,
                                            )[0].value.timestampValue,
                                          ),
                                        ).toISOString(),
                                      );
                                    }}
                                  >
                                    {timeDifference(
                                      new Date(selectedCommand.generationTime),
                                      new Date(
                                        parseInt(
                                          selectedCommand.attr.filter(
                                            (a) =>
                                              a.name ===
                                              `Acknowledge_${ack.name.split("_")[1]}_Time`,
                                          )[0].value.timestampValue,
                                        ),
                                      ),
                                    )}
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {new Date(
                                      parseInt(
                                        selectedCommand.attr.filter(
                                          (a) =>
                                            a.name ===
                                            `Acknowledge_${ack.name.split("_")[1]}_Time`,
                                        )[0].value.timestampValue,
                                      ),
                                    ).toISOString()}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </TooltipProvider>
          )}
          <pre>{JSON.stringify(data.entry[7], undefined, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function base64ToBinary(base64String: string) {
  // Decode the base64 string into raw binary data
  const binaryString = atob(base64String); // atob decodes base64 into binary string

  // Convert each character (byte) into an 8-bit binary string and join with a space
  const binaryWithSpaces = Array.from(binaryString)
    .map((char) => {
      // Convert each character's char code to a binary string and pad to 8 bits
      return char.charCodeAt(0).toString(2).padStart(8, "0");
    })
    .join(" "); // Join the binary bytes with spaces

  return binaryWithSpaces;
}

function timeDifference(date1: Date, date2: Date): string {
  const diff = date2.getTime() - date1.getTime(); // Difference in milliseconds
  const sign = diff >= 0 ? "+" : "-"; // Determine the sign of the difference
  return `${sign}${Math.abs(diff) - 37000}ms`; // Format the output as a string
}
