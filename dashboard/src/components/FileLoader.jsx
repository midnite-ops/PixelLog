export default function FileLoader({ setLogs }) {
  function handleFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setLogs(data);
      } catch (err) {
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
      <p className="mb-3 text-gray-600">Upload your PixelLog JSON file</p>
      <input type="file" accept="application/json" onChange={handleFile} />
    </div>
  );
}
