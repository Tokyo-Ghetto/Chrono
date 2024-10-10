import { DotsItem, useTheme } from "@nivo/core";
import { CustomLayerProps, SliceTooltipProps } from "@nivo/line";

type CurrentSlice = {
  currentSlice: SliceTooltipProps["slice"];
};

export function ActivePoint({
  currentSlice,
  ...props
}: CustomLayerProps & CurrentSlice) {
  const theme = useTheme();

  return (
    <g>
      {currentSlice?.points.map((point) => (
        <DotsItem
          key={point.id}
          x={point.x}
          y={point.y}
          datum={point.data}
          symbol={props.pointSymbol}
          size={12}
          color={point.borderColor}
          borderWidth={props.pointBorderWidth}
          borderColor={point.color}
          label={point.label}
          labelYOffset={props.pointLabelYOffset}
          theme={theme}
        />
      ))}
    </g>
  );
}
