const sendHttpRequest = (method, url, cbSuccess, cbFail) => {
	const xhr = new XMLHttpRequest();

	xhr.open(method, url);

	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			const status = xhr.status;
			if (status >= 200 && status < 400) {
				cbSuccess(xhr.responseText);
			} else {
				cbFail('Could not fetch data, please try again later.');
			}
		}
	};

	xhr.send();
};

export { sendHttpRequest };
