import ReactDOM from "react-dom";
import App from "./routes/App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import reduxStore, { persistor } from "./redux";
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";
import themeUtils from "./utils/ThemeUtils";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/theme.css";

// Initialize theme system before rendering
themeUtils.init();

const renderApp = () => {
    ReactDOM.render(
        <Provider store={reduxStore}>
            <IntlProviderWrapper>
                <App persistor={persistor} />
            </IntlProviderWrapper>
        </Provider>,
        document.getElementById("root")
    );
};

renderApp();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
