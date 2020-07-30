import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Route exact path="/activities" component={ActivityDashboard} />
              <Route path="/activities/:id" component={ActivityDetails} />
              {/* pass array of routes to path */}
              <Route
                key={location.key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              />
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));

//legacy code before mobx
// const handleEditActivity = (activity: IActivity) => {
//   setSubmitting(true);
//   agent.Activities.update(activity)
//     .then(() => {
//       setActivities([
//         ...activities.filter((a) => a.id !== activity.id),
//         activity,
//       ]);
//       setSelectedActivity(activity);
//       setEditMode(false);
//     })
//     .then(() => setSubmitting(false));
// };

// const handleDeleteActivity = (
//   event: SyntheticEvent<HTMLButtonElement>,
//   id: string
// ) => {
//   setSubmitting(true);
//   setTarget(event.currentTarget.name);
//   agent.Activities.delete(id)
//     .then(() => {
//       setActivities([...activities.filter((a) => a.id !== id)]);
//     })
//     .then(() => setSubmitting(false));
// };
