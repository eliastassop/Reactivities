import { RootStore } from "./rootStore";
import { observable, action, reaction } from "mobx";

// reaction in mobx
// we can react to observables auto and if token changes we can do something,
//we can use inside constructor, and thhere is 2 different types of reactions
// 1st is called autorun which means when store initializes its automatically going to run this reaction every single time
// our reaction is going to run after store initializes and when its changed
//

export default class CommonStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    // when we setToken reaction below isgoing to run and write on localstorage
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem("jwt", token);
        } else {
          window.localStorage.removeItem("jwt");
        }
      }
    );
  }

  @observable token: string | null = null;
  @observable appLoaded = false;

  @action setToken = (token: string | null) => {
    // dont need setlocalstorage token here because we have reaction.
    this.token = token;
  };

  @action setAppLoaded = () => {
    this.appLoaded = true;
  };
}
