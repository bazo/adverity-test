import React from "react";
import { ChartPoints } from "../../libs/dataSource";
import { ResponsiveLine } from "@nivo/line";

const Chart = ({ data }: { data: ChartPoints }) => {
	console.log(Object.values(data));
	return (
		<div style={{ height: "100vh" }}>
			<ResponsiveLine
				data={Object.values(data)}
				margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
				yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
				xScale={{
					type: "time",
					format: "%Y-%m-%d",
					precision: "day"
				}}
				xFormat="time:%Y-%m-%d"
				axisTop={null}
				axisLeft={{
					orient: "left",
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: "clicks",
					legendOffset: -100,
					legendPosition: "middle"
				}}
				axisRight={{
					orient: "right",
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: "impressions",
					legendOffset: 100,
					legendPosition: "middle"
				}}
				axisBottom={{
					format: "%d.%m",
					tickValues: "every 1 days",
					legend: "time scale",
					orient: "bottom",
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legendOffset: 40,
					legendPosition: "middle"
				}}
				colors={{ scheme: "nivo" }}
				pointSize={10}
				pointColor={{ theme: "background" }}
				pointBorderWidth={2}
				pointBorderColor={{ from: "serieColor" }}
				pointLabel="y"
				pointLabelYOffset={-12}
				useMesh={true}
				//enableSlices="x" nicer but very slow
				legends={[
					{
						anchor: "bottom-right",
						direction: "column",
						justify: false,
						translateX: 100,
						translateY: 0,
						itemsSpacing: 0,
						itemDirection: "left-to-right",
						itemWidth: 80,
						itemHeight: 20,
						itemOpacity: 0.75,
						symbolSize: 12,
						symbolShape: "circle",
						symbolBorderColor: "rgba(0, 0, 0, .5)",
						effects: [
							{
								on: "hover",
								style: {
									itemBackground: "rgba(0, 0, 0, .03)",
									itemOpacity: 1
								}
							}
						]
					}
				]}
			/>
		</div>
	);
};

export default Chart;
