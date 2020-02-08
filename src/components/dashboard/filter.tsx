import React, { useRef, useState, useEffect } from "react";
import MultiSelect from "../multiSelect";
import DataSource from "../../libs/dataSource";

type OnChange = (sources: string[], campaigns: string[]) => void;

const Filter = ({ source, onChange }: { source: DataSource; onChange: OnChange }) => {
	const sourceNames = useRef<string[]>(source.getSourceNames());

	const [selectedSources, setSources] = useState([] as string[]);
	const [availableCampaigns, setAvailableCampaigns] = useState(source.getCampaignNamesForSources(selectedSources));
	const [selectedCampaigns, setCampaigns] = useState([] as string[]);

	useEffect(() => {
		const availableCampaigns = source.getCampaignNamesForSources(selectedSources);
		setAvailableCampaigns(availableCampaigns);
	}, [selectedSources]);

	return (
		<div>
			<h2>Filter</h2>
			<MultiSelect title="Datasource" items={sourceNames.current} onChange={setSources} /> <br />
			<MultiSelect title="Campaign" items={availableCampaigns} onChange={setCampaigns} /> <br />
			<button className="btn btn-success" onClick={onChange.bind(null, selectedSources, selectedCampaigns)}>
				Apply
			</button>
		</div>
	);
};

export default Filter;
