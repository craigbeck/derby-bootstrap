import derby from 'derby';

const app = derby.createApp('derby-bootstrap', __filename);

app.loadViews(__dirname);

app.get('/', page => {
  page.render();
});

export default app;
