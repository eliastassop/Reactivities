import { observable, action, computed, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";

import { RootStore } from "./rootStore";
// when i see proxy in console.log an array thats because they are observables

export default class ActivityStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();

  @observable activity: IActivity | null = null;
  @observable loadingInitial = false;

  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  // take this array activityRegistry.values() and constract a new group of arrays
  // where each unique day has an array of activities,
  //so unique date acts as a key inside a new object thats gonna have an array of activities as a value

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    //return sortedActivities;
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        //  date=
        //  date.split("-")[0] +
        //  date.split("-")[1] +
        //  activity.date.getDate();
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadActivities = async () => {
    // mutating state works in mobx not in redux
    this.loadingInitial = true;

    try {
      const activities = await agent.Activities.list();
      runInAction("loading activities", () => {
        activities.forEach((activity) => {
          activity.date = new Date(activity.date + "Z");
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
      //console.log(this.groupActivitiesByDate(activities));
    } catch (error) {
      runInAction("load activities error", () => {
        this.loadingInitial = false;
      });

      console.log(error);
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction("getting activity", () => {
          activity.date = new Date(activity.date + "Z");
          console.log(activity.date);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction("getting activity error", () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  @action clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction("creating activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("create activity error", () => {
        this.submitting = false;
      });
      toast.error("problem submitting data");
      console.log(error);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.update(activity);
      runInAction("editing activity", () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
        console.log(activity.date);
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction("editing activity error", () => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction("deleting activity", () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";

        // diko mou
        this.activity = null;
      });
    } catch (error) {
      runInAction("deleting activity error", () => {
        this.submitting = false;
        this.target = "";
      });

      console.log(error);
    }
  };
}

// REMOVED WHEN USED REACT ROUTER TO BROWSE AROUND DIF COMPONENTS
// @action openCreateForm = () => {
//   this.editMode = true;
//   this.activity = null;
// };
// @action openEditForm = (id: string) => {
//   this.activity = this.activityRegistry.get(id);
//   this.editMode = true;
// };

// @action cancelSelectedActivity = () => {
//   this.activity = null;
// };

// @action cancelFormOpen = () => {
//   this.editMode = false;
// };

// @action selectActivity = (id: string) => {
//   this.activity = this.activityRegistry.get(id);
//   this.editMode = false;
// };

// @computed get activitiesByDate() {
//      iterable of values in the map then add to array
//   return Array.from(this.activityRegistry.values()).sort(
//     (a, b) => Date.parse(a.date) - Date.parse(b.date)
//   );
// }
