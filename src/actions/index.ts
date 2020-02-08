import Papa from "papaparse";
import DataSource, { Row } from "../libs/dataSource";

const DATASOURCE_URL = "http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv";
const STORAGE_KEY = "csvData";

export async function fetchData(): Promise<DataSource> {
	let text = localStorage.getItem(STORAGE_KEY);

	if (!text) {
		const res = await fetch(DATASOURCE_URL);
		text = await res.text();

		localStorage.setItem(STORAGE_KEY, text);
	}

	const dataSource = new DataSource();

	return new Promise((resolve, reject) => {
		Papa.parse(text, {
			//download: true, cors not enabled on the file, need to use fetch first
			worker: true,
			header: true,
			dynamicTyping: true,
			skipEmptyLines: true,
			//transformHeader: header => header.toLowerCase(), //throws some weird error, guess due to the use of workers
			step: function(row: Papa.ParseResult) {
				dataSource.addRow((row.data as unknown) as Row);
			},
			complete: (results: Papa.ParseResult, file: File) => {
				resolve(dataSource);
			}
		});
	});
}
