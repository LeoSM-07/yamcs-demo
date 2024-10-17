import { CircleUser, Home, Menu, Rocket, SatelliteDish } from "lucide-react";
import "./App.css";
import { Dashboard } from "./components/dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { cn } from "./lib/utils";
import { Commanding } from "./components/commanding";

const queryClient = new QueryClient();

interface Page {
  title: string;
  slug: string;
  icon: React.ReactNode;
}
const pages: Page[] = [
  {
    title: "Dashboard",
    slug: "/",
    icon: <Home className="w-full h-full" />,
  },
  {
    title: "Commanding",
    slug: "/commanding",
    icon: <SatelliteDish className="w-full h-full" />,
  },
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0 z-50">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link to="/" className="flex items-center gap-2 font-semibold">
                  <Rocket className="h-6 w-6" />
                  <span className="">YAMCS Demo</span>
                </Link>
              </div>
              <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  {pages.map((page) => (
                    <NavLink
                      key={page.slug}
                      to={page.slug}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                          isActive ? "bg-muted text-primary" : "",
                        )
                      }
                    >
                      <span className="w-4 h-4">{page.icon}</span>
                      {page.title}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-[#FAFBFC] px-4 lg:h-[60px] lg:px-6 sticky top-0 backdrop-blur-sm z-50">
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
                  <nav className="grid gap-2 text-lg font-medium pb-5">
                    <Link
                      to=""
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <Rocket className="h-6 w-6" />
                      <span className="sr-only">Acme Inc</span>
                    </Link>
                    {pages.map((page) => (
                      <NavLink
                        key={page.slug}
                        to={page.slug}
                        className={({ isActive }) =>
                          cn(
                            "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                            isActive ? "bg-muted text-primary" : "",
                          )
                        }
                      >
                        <span className="w-5 h-5">{page.icon}</span>
                        {page.title}
                      </NavLink>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
              <div className="w-full flex-1 sticky top-0">
                <h1 className="text-lg font-semibold md:text-2xl">
                  Mission Database
                </h1>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
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
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/commanding" element={<Commanding />} />
                <Route path="*" element={<div>Not Found</div>} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
