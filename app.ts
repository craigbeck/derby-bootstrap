import derby from 'derby';
import Hello from './components/hello';


const app = derby.createApp('derby-bootstrap', __filename);

app.component(Hello);
app.loadViews(__dirname);

app.get('/', page => {
  page.render();
});

export default app;
