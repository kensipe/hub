import { isUndefined } from 'lodash';

import { API } from '../api';
import { AuthorizerAction, AuthorizerInput } from '../types';

export class Authorizer {
  private allowedActions: (AuthorizerAction | string)[] = ['all'];
  private selectedOrg?: string;
  private gettingActions: boolean = false;
  private pendingActions: (() => void)[] = [];

  public init(selectedOrg?: string) {
    this.selectedOrg = selectedOrg;
    if (!isUndefined(selectedOrg)) {
      this.getAllowedActionsList();
    }
  }

  public updateCtx(selectedOrg?: string) {
    if (isUndefined(selectedOrg)) {
      this.selectedOrg = undefined;
      this.allowedActions = [];
    } else if (this.selectedOrg !== selectedOrg) {
      this.selectedOrg = selectedOrg;
      this.getAllowedActionsList();
    }
  }

  public check(input: AuthorizerInput): boolean {
    if (!isUndefined(input.organizationName) && input.organizationName !== this.selectedOrg) {
      this.selectedOrg = input.organizationName;
      this.getAllowedActionsList();
      return true;
    } else {
      if (this.gettingActions && !isUndefined(input.onCompletion) && input.organizationName) {
        this.pendingActions.push(input.onCompletion);
        return false;
      } else {
        if (isUndefined(this.selectedOrg) || this.allowedActions.includes('all')) {
          return true;
        } else {
          return this.allowedActions.includes(input.action);
        }
      }
    }
  }

  public getAllowedActionsList(onCompletion?: () => void) {
    const getUserAllowedActions = async () => {
      try {
        this.gettingActions = true;
        this.allowedActions = await API.getUserAllowedActions(this.selectedOrg!);
        if (!isUndefined(onCompletion)) {
          onCompletion();
        }
        if (this.pendingActions.length > 0) {
          this.pendingActions.forEach((action: () => void) => action());
          this.pendingActions = [];
        }
        this.gettingActions = false;
      } catch (err) {
        this.allowedActions = ['all'];
        this.gettingActions = false;
      }
    };

    if (!isUndefined(this.selectedOrg)) {
      getUserAllowedActions();
    }
  }
}

const authorizer = new Authorizer();
export default authorizer;