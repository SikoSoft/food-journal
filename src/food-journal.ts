import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { config } from './models/Config';

import './components/action-nav';
import './components/action-form';
import './components/action-list';
import { ActionView } from './models/Action';
import { theme } from './styles/theme';

import { MobxLitElement } from '@adobe/lit-mobx';
import { appState } from './state';

export interface ViewChangedEvent extends Event {
  detail: ActionView;
}

@customElement('food-journal')
export class FoodJournal extends MobxLitElement {
  private state = appState;

  static styles = [theme];

  header = 'My app';
  @state() view: ActionView = ActionView.INPUT;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('view-changed', (e: Event) => {
      const event = e as ViewChangedEvent;
      this.view = event.detail;
    });

    this._getSuggestions();
  }

  private async _getSuggestions() {
    try {
      const res = await fetch(`${config.apiUrl}actionSuggestion`);
      const json = (await res.json()) as { suggestions: string[] };
      this.state.setAutoSuggestions(json.suggestions);
    } catch (error) {
      console.error(`Failed to get suggestions: ${JSON.stringify(error)}`);
    }
  }

  _activeView() {
    switch (this.view) {
      case ActionView.INPUT:
        return html`<action-form></action-form>`;
    }
    return html`<action-list></action-list>`;
  }

  render() {
    return html`
      <action-nav active=${this.view}></action-nav>
      <main>${this._activeView()}</main>
    `;
  }
}
