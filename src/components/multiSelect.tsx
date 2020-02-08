import React, { useState, useEffect, useRef } from "react";
import without from "ramda/src/without";

export interface Item {
	title: string;
	value: string;
}

type OnChange = (values: string[]) => void;

const MultiSelect = ({ title = "", items = [], onChange }: { title: string; items: string[]; onChange: OnChange }) => {
	const node = useRef();
	const [isOpen, setOpen] = useState(false);
	const [values, setValues] = useState([]);
	const [shownItems, setShownItems] = useState(items);

	const open = () => setOpen(true);
	const close = () => setOpen(false);

	const addValue = (value: any) => {
		const index = values.indexOf(value);
		if (index === -1) {
			const newValues = values.concat(value);
			setValues(newValues);
			onChange(newValues);
		}
	};

	const removeValue = (key: number) => {
		const newValues = [...values];
		newValues.splice(key, 1);
		setValues(newValues);
		onChange(newValues);
	};

	useEffect(() => {
		const shownItems = without<string>(values, items);
		setShownItems(shownItems);

		if (shownItems.length === 0) {
			close();
		}
	}, [values, items]);

	const handleClickOutside = (e: MouseEvent) => {
		//@ts-ignore
		if (node.current.contains(e.target)) {
			// inside click
			return;
		}
		// outside click
		close();
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<>
			{title}
			<div className="btn-group" ref={node}>
				<button type="button" className="btn btn-info">
					{values.length === 0
						? `All (${items.length})`
						: values.map((value, index) => {
								return (
									<span className="badge badge-pill badge-light" key={index}>
										<span onClick={removeValue.bind(null, index)}>&times;</span>
										&nbsp;{value}
									</span>
								);
						  })}
				</button>
				<button className="btn btn-info dropdown-toggle dropdown-toggle-split" onClick={open}>
					<span className="sr-only">Toggle Dropdown</span>
				</button>
				{isOpen && (
					<div className="dropdown-menu show">
						{shownItems.map(item => {
							return (
								<button
									className="dropdown-item"
									type="button"
									key={item}
									onClick={addValue.bind(null, item)}
								>
									{item}
								</button>
							);
						})}
					</div>
				)}
			</div>
		</>
	);
};

export default MultiSelect;
