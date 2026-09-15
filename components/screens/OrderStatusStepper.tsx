import { cn } from "@/components/ui";
import type { Order, OrderStatus } from "@/lib/mock/types";

const HAPPY: OrderStatus[] = ["PLACED", "CONFIRMED", "DELIVERED"];
const HAPPY_LABEL: Record<string, string> = {
  PLACED: "განთავსდა",
  CONFIRMED: "დადასტურდა",
  DELIVERED: "მიწოდდა",
};

function timeFor(order: Order, status: OrderStatus): string | undefined {
  return order.events.find((e) => e.status === status)?.at;
}

interface Node {
  label: string;
  time?: string;
  done: boolean;
  danger?: boolean;
}

function Rail({ nodes }: { nodes: Node[] }) {
  return (
    <div>
      <div className="flex items-center">
        {nodes.map((n, i) => (
          <div key={i} className="flex flex-1 items-center last:flex-none">
            {i > 0 && (
              <div
                className={cn(
                  "h-0.5 flex-1",
                  nodes[i - 1].done && n.done ? "bg-ok" : "bg-line",
                )}
              />
            )}
            <span
              className={cn(
                "h-2.5 w-2.5 shrink-0 rounded-full",
                !n.done
                  ? "bg-line-strong"
                  : n.danger
                    ? "bg-danger"
                    : "bg-ok",
              )}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex">
        {nodes.map((n, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 text-center",
              i === 0 && "text-left",
              i === nodes.length - 1 && "text-right",
            )}
          >
            <p
              className={cn(
                "text-small",
                n.done ? (n.danger ? "text-danger" : "text-ink") : "text-ink-3",
              )}
            >
              {n.label}
            </p>
            <p className="tabular mt-0.5 text-micro text-ink-3">
              {n.time ?? "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Order lifecycle as a horizontal stepper — reads at a glance instead of a
 *  timestamped bullet list. Rejection/cancellation is a short-circuit off the
 *  happy path, not a fourth step on it, so it renders as its own 2-node rail. */
export function OrderStatusStepper({ order }: { order: Order }) {
  if (order.status === "REJECTED" || order.status === "CANCELLED") {
    const termEvent = order.events[order.events.length - 1];
    const reason =
      order.status === "REJECTED" ? termEvent?.label.split(" — ")[1] : undefined;
    const nodes: Node[] = [
      { label: "განთავსდა", time: timeFor(order, "PLACED"), done: true },
      {
        label: order.status === "REJECTED" ? "უარყოფილია" : "გაუქმებულია",
        time: termEvent?.at,
        done: true,
        danger: true,
      },
    ];
    return (
      <div>
        <Rail nodes={nodes} />
        {reason && (
          <p className="mt-3 border-l-2 border-danger pl-2 text-small text-danger">
            მიზეზი: {reason}
          </p>
        )}
      </div>
    );
  }

  const idx = HAPPY.indexOf(order.status);
  const nodes: Node[] = HAPPY.map((s, i) => ({
    label: HAPPY_LABEL[s],
    time: timeFor(order, s),
    done: i <= idx,
  }));
  return <Rail nodes={nodes} />;
}
