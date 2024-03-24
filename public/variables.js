const port = 3000;
const host = `http://15.235.192.220:${port}`;
const apiTrips = `http://15.235.192.220:${port}/api/trips`;
const apiDestinations = `http://15.235.192.220:${port}/api/destinations`;
const apiComments = `http://15.235.192.220:${port}/api/comments`;
const apiReminders = `http://15.235.192.220:${port}/api/reminders`;
const apiUpload = `http://15.235.192.220:${port}/api/uploads`;
const apiAuth = `http://15.235.192.220:${port}/api/auth`;
const apiPublic = `http://15.235.192.220:${port}/api/public`;


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