import {Route, Switch} from "react-router";
import RestaurantMap from "./pages/RestaurantMap";
import SharedMap from "./pages/SharedMap";
import DetailMap from "./pages/DetailMap";
import SearchMap from "./pages/SearchMap";


function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path="/">
                    <RestaurantMap/>
                </Route>
                <Route exact path="/places">
                    <SharedMap/>
                </Route>
                <Route exact path="/detail">
                    <DetailMap/>
                </Route>
                <Route exact path="/search">
                    <SearchMap/>
                </Route>
            </Switch>
        </div>
    );
}

export default App;
