import { makeAutoObservable, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { textChangeRangeIsUnchanged } from "typescript";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

class ActivityStore {
  constructor() {
    makeAutoObservable(this);
  }

  /* Observables */
  activityRegistry = new Map();
  activities: IActivity[] = [];
  activity: IActivity | null = null;
  loadingInitial = false;
  editMode = false;
  submitting = false;
  target = "";

  /* Computed */
  get activitiesByDate() {
    return Array.from(this.activityRegistry.values())
      .slice()
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  /* Actions */
  loadActivities = async () => {
    this.loadingInitial = true;
    // Using async and await
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction(() => {
          this.activity = activity;
          this.loadingInitial = false;
        });
      } catch (error) {
        runInAction(() => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  clearActivity = () => {
    this.activity = null;
  }    

  createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      console.log(error);
    }
  };

  deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.target = "";
      });
      console.log(error);
    }
  };

  /* Using Promises instead await*/
  // agent.Activities.list()
  //   .then((activities) => {
  //     activities.forEach((activity) => {
  //       activity.date = activity.date.split(".")[0];
  //       this.activities.push(activity);
  //     });
  //   })
  //   .catch((error) => console.log(error))
  //   .finally(() => (this.loadingInitial = false));

  openCreateForm = () => {
    this.editMode = true;
    this.activity = null;
  };

  openEditForm = (id: string) => {
    this.activity = this.activityRegistry.get(id);
    this.editMode = true;
  };

  cancelSelectedActivity = () => {
    this.activity = null;
  };

  cancelFormOpen = () => {
    this.editMode = false;
  };

  selectActivty = (id: string) => {
    this.activity = this.activityRegistry.get(id);
    this.editMode = false;
  };

  // Helpers
  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };
}

export default createContext(new ActivityStore());
