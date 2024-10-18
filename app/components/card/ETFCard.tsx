import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { getChartColor } from "~/utils/colors";
import { ETFCardProps } from "~/types/etf";
import { Link } from "@remix-run/react";

const ETFCard: React.FC<ETFCardProps> = ({
  ticker,
  name,
  endPrice,
  priceChangePercentage,
  chartLines,
}) => {
  const lineColor = getChartColor(priceChangePercentage);

  return (
    <div>
      <Link to={`/test?ticker=${ticker}`}>
        <Card className="w-[350px] !bg-zinc-800 cursor-pointer">
          <CardHeader className="flex flex-row justify-between align-items: flex-start">
            <div>
              <CardTitle>{ticker}</CardTitle>
              <CardDescription>{name}</CardDescription>
            </div>
            <div className="!mt-0">
              <CardTitle>{endPrice}</CardTitle>
              <CardDescription className="text-neutral-500 dark:text-neutral-400">
                {priceChangePercentage}%
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div id="card_chart" className="h-20">
              <ResponsiveLine
                data={chartLines}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: true,
                  reverse: false,
                }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                isInteractive={false}
                colors={[lineColor]}
                enablePoints={false}
                enableGridX={false}
                enableGridY={false}
              />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default ETFCard;
