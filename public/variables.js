const port = 3000;
const host = `http://localhost:${port}`;
const apiTrips = `http://localhost:${port}/api/trips`;
const apiDestinations = `http://localhost:${port}/api/destinations`;
const apiComments = `http://localhost:${port}/api/comments`;
const apiReminders = `http://localhost:${port}/api/reminders`;
const apiUpload = `http://localhost:${port}/api/uploads`;
const apiAuth = `http://localhost:${port}/api/auth`;
const apiPublic = `http://localhost:${port}/api/public`;


const { fetch: origFetch } = window;
window.fetch = async (...args) => {
  // add authorization header to every request
  args[1] = args[1] || {};
  args[1].headers = {
    ...args[1].headers,
    Authorization: `Bearer ${localStorage.getItem('token')}`
  };

  const response = await origFetch(...args);

  response
    .clone()
    .json()
    .then(data => {
      if (data.success === false) {
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        /* the original response can be resolved unmodified: */
        return response;
      }
    })
    .catch(err => console.error(err));

    return response;
};