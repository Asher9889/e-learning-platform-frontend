import { useState, useEffect } from "react";
import { SidebarTrigger } from "#components/ui/sidebar";
import { Button } from "#components/ui/button";
import { Separator } from "#components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Search,
  Bell,
  CalendarDays,
  Clock,
  ChevronDown,
  Home,
  BookOpen,
  FileText,
} from "lucide-react";
import { cn } from "#lib/utils";

interface RouteNode {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: RouteNode[];
}

interface AppHeaderProps {
  className?: string;
  routeTree?: RouteNode[];
  currentPath?: string[];
}

const defaultRouteTree: RouteNode[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-3.5 w-3.5" />,
  },
  {
    label: "Courses",
    icon: <BookOpen className="h-3.5 w-3.5" />,
    children: [
      { label: "All Courses", href: "/courses" },
      { label: "My Enrollments", href: "/courses/enrolled" },
      { label: "Bookmarks", href: "/courses/bookmarks" },
    ],
  },
  {
    label: "Assignments",
    icon: <FileText className="h-3.5 w-3.5" />,
    children: [
      { label: "Pending", href: "/assignments/pending" },
      { label: "Submitted", href: "/assignments/submitted" },
      { label: "Graded", href: "/assignments/graded" },
    ],
  },
];

const AppHeader = ({
  className,
  routeTree = defaultRouteTree,
  currentPath = ["Courses", "All Courses"],
}: AppHeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const findRouteNode = (
    label: string,
    tree: RouteNode[] = routeTree
  ): RouteNode | undefined => {
    for (const node of tree) {
      if (node.label === label) return node;

      if (node.children) {
        const found = findRouteNode(label, node.children);
        if (found) return found;
      }
    }

    return undefined;
  };

  const renderBreadcrumbItem = (
    segment: string,
    isLast: boolean
  ) => {
    const node = findRouteNode(segment);
    const hasChildren =
      node?.children && node.children.length > 0;

    if (isLast) {
      return (
        <BreadcrumbItem>
          <BreadcrumbPage className="max-w-[160px] truncate text-sm font-semibold text-foreground">
            {segment}
          </BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    if (hasChildren) {
      return (
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <BreadcrumbLink className="flex max-w-[120px] cursor-pointer items-center gap-1 truncate text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:max-w-none">
                {node?.icon}
                <span className="truncate">
                  {segment}
                </span>

                <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
              </BreadcrumbLink>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="rounded-lg"
            >
              {node.children?.map(child => (
                <DropdownMenuItem
                  key={child.label}
                  className="cursor-pointer"
                >
                  {child.icon}
                  {child.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      );
    }

    return (
      <BreadcrumbItem>
        <BreadcrumbLink
          href={node?.href || "#"}
          className="flex max-w-[120px] items-center gap-1 truncate text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:max-w-none"
        >
          {node?.icon}
          <span className="truncate">
            {segment}
          </span>
        </BreadcrumbLink>
      </BreadcrumbItem>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 md:h-16 w-full items-center justify-between border-b bg-background/80 px-3 md:px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70",
        className
      )}
    >
      {/* Left */}
      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        <SidebarTrigger className="h-9 w-9 shrink-0 rounded-lg" />

        <Separator
          orientation="vertical"
          className="hidden h-6 sm:block"
        />

        {/* Mobile Breadcrumb */}
        <div className="sm:hidden min-w-0">
          <h1 className="max-w-[140px] truncate text-sm font-semibold">
            {currentPath[currentPath.length - 1]}
          </h1>
        </div>

        {/* Desktop Breadcrumb */}
        <div className="hidden min-w-0 sm:block">
          <Breadcrumb>
            <BreadcrumbList className="flex min-w-0 items-center gap-1 overflow-hidden">
              {currentPath.map((segment, index) => (
                <div
                  key={segment}
                  className="flex items-center gap-1"
                >
                  {index > 0 && (
                    <BreadcrumbSeparator />
                  )}

                  {renderBreadcrumbItem(
                    segment,
                    index === currentPath.length - 1
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Center Search */}
      <div className="hidden flex-1 items-center justify-center px-4 lg:flex">
        <Button
          variant="outline"
          className="relative h-10 w-full max-w-lg xl:max-w-xl justify-start rounded-xl bg-muted/40 text-sm font-normal text-muted-foreground shadow-none"
        >
          <Search className="mr-2 h-4 w-4" />
          Search students, teachers, classes...

          <kbd className="absolute right-2 hidden h-5 items-center rounded border bg-background px-1.5 text-[10px] font-medium sm:flex">
            ⌘ K
          </kbd>
        </Button>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        {/* Mobile Search */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg lg:hidden"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Desktop Date Time */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border bg-muted/30 px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">
              {formattedDate}
            </span>
          </div>

          <Separator
            orientation="vertical"
            className="h-4"
          />

          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold tabular-nums">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Mobile Time */}
        <div className="flex lg:hidden items-center gap-1 rounded-lg bg-muted/40 px-2 py-1">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold tabular-nums">
            {formattedTime}
          </span>
        </div>

        <Separator
          orientation="vertical"
          className="hidden h-6 sm:block"
        />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-xl border border-transparent transition-all hover:border-border hover:bg-muted/60"
        >
          <Bell className="h-[18px] w-[18px]" />

          <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-primary ring-2 ring-background" />
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;