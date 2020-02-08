import React, { useState, useEffect } from "react";
import { fetchData } from "../actions";
import Loader from "../components/loader";
import DataSource from "../libs/dataSource";
import Filter from "./dashboard/filter";
import Chart from "./dashboard/chart";

const Dashboard = () => {
	const [loading, setLoading] = useState(true);
	const [source, setSource] = useState(null as DataSource);
	const [chartPoints, setChartPoints] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetchData().then(source => {
			setSource(source);
			const chartPoints = source.getChartPoints([], []);
			setChartPoints(chartPoints);
			setLoading(false);
		});
	}, []);

	const onFilterChange = (sources: string[], campaigns: string[]) => {
		const chartPoints = source.getChartPoints(sources, campaigns);
		setChartPoints(chartPoints);
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="row">
			<div className="col-2">
				<Filter source={source} onChange={onFilterChange} />
			</div>
			<div className="col-10">
				<Chart data={chartPoints} />
			</div>
		</div>
	);
};

export default Dashboard;
