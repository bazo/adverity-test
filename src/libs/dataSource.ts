import { parse, format as formatDate } from "date-fns";
import uniq from "ramda/src/uniq";

export interface Row {
	Date: string;
	Datasource: string;
	Campaign: string;
	Clicks: number;
	Impressions: number;
}

export interface DataPoint {
	timestamp: number;
	clicks: number;
	impressions: number;
}

interface ChartPoint {
	x: string;
	y: number;
}

export interface ChartPoints {
	clicks: {
		id: string;
		data: ChartPoint[];
	};
	impressions: {
		id: string;
		data: ChartPoint[];
	};
}

const dateStringToTimestamp = (date: string, format = "dd.MM.yyyy"): number => {
	return parse(date, format, new Date()).valueOf();
};

const timestampToDateString = (timestamp: number | string, format = "yyyy-MM-dd"): string => {
	return formatDate(parseInt(timestamp.toString()), format);
};

const pointComparator = (a: ChartPoint, b: ChartPoint) => {
	if (a.x > b.x) {
		return 1;
	}

	if (a.x < b.x) {
		return -1;
	}

	return 0;
};

export default class DataSource {
	private data = {};

	public addRow = ({
		Datasource: datasource,
		Campaign: campaign,
		Date: date,
		Clicks: clicks,
		Impressions: impressions
	}: Row): void => {
		if (!this.data[datasource]) {
			this.data[datasource] = {};
		}

		if (!this.data[datasource][campaign]) {
			this.data[datasource][campaign] = [] as DataPoint[];
		}

		const timestamp = dateStringToTimestamp(date);

		this.data[datasource][campaign].push({
			timestamp,
			clicks,
			impressions
		} as DataPoint);
	};

	public getSourceNames = (): string[] => {
		return Object.keys(this.data);
	};

	public getCampaignNamesForSources = (sources: string[]): string[] => {
		let names = [] as string[];

		if (sources.length === 0) {
			sources = Object.keys(this.data);
		}

		sources.forEach(sourceName => {
			const campaignNames = Object.keys(this.data[sourceName]);
			names = [...names, ...campaignNames];
		});

		return uniq<string>(names).sort();
	};

	public getChartPoints = (sources: string[], campaigns: string[]): ChartPoints => {
		const points = {
			clicks: { id: "clicks", data: [] },
			impressions: { id: "impressions", data: [] }
		} as ChartPoints;

		const byTimestamp = {} as { [key: number]: { clicks: number; impressions: number }[] };
		const byTimestampReduced = {} as { [key: number]: { clicks: number; impressions: number } };

		if (sources.length === 0) {
			sources = Object.keys(this.data);
		}

		sources.forEach(sourceName => {
			const campaignsData = this.data[sourceName];

			if (campaigns.length === 0) {
				campaigns = this.getCampaignNamesForSources(sources);
			}

			campaigns.forEach(campaignName => {
				const campaign = campaignsData[campaignName] as DataPoint[];
				if (campaign) {
					campaign.forEach(({ timestamp, clicks, impressions }) => {
						if (!byTimestamp[timestamp]) {
							byTimestamp[timestamp] = [];
						}

						byTimestamp[timestamp].push({ clicks, impressions });
					});
				}
			});
		});

		for (let timestamp in byTimestamp) {
			const data = byTimestamp[timestamp].reduce(
				(acc, { clicks, impressions }) => {
					return {
						clicks: acc.clicks + clicks || 0,
						impressions: acc.impressions + impressions || 0
					};
				},
				{ clicks: 0, impressions: 0 }
			);
			byTimestampReduced[timestamp] = data;
		}

		Object.entries(byTimestampReduced).forEach(([timestamp, { clicks, impressions }]) => {
			points.clicks.data.push({ x: timestampToDateString(timestamp), y: clicks });
			points.impressions.data.push({ x: timestampToDateString(timestamp), y: impressions });
		});

		points.clicks.data.sort(pointComparator);
		points.impressions.data.sort(pointComparator);

		return points;
	};
}
