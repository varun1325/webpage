document.getElementById('eventForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Format start and end dates
    data.startDate = new Date(data.startDate).toISOString();
    data.endDate = new Date(data.endDate).toISOString();
    
    try {
        const response = await fetch('http://localhost:3000/create-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.log('Error submitting form:', error);
        alert('There was a problem submitting the form.'+error);
    }
});
