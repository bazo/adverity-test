import React from "react";
import "../styles/loader.css";

const Loader = () => (
	<div className="loader">
		<div className="lds-ring">
			<div />
			<div />
			<div />
			<div />
		</div>
	</div>
);

export default Loader;
