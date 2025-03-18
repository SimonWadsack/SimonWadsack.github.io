import { LaceElement } from '../LaceElement.js';
import { FolderElement } from './folderElement.js';
import { GroupElement } from './groupElement.js';

class TabElement extends LaceElement {
    tabGroup;
    lace;
    tabs = [];
    laceTabs = new Map();
    eventFunctions = new Map();
    vertical;
    activeTab = "";
    constructor(lace, options = {}) {
        const { vertical = false, onTabChange = (() => { }) } = options;
        const tabGroup = document.createElement('sl-tab-group');
        tabGroup.placement = vertical ? 'start' : 'top';
        tabGroup.style.marginRight = "-1em";
        tabGroup.style.marginBottom = "-1em";
        tabGroup.style.marginLeft = "-1em";
        super("laceTab", tabGroup);
        this.tabGroup = tabGroup;
        this.lace = lace;
        this.vertical = vertical;
        this.tabGroup.addEventListener('sl-tab-show', (event) => {
            const tabName = event.detail.name;
            if (this.eventFunctions.has(tabName)) {
                const { onSel, onDeSel } = this.eventFunctions.get(tabName);
                onSel();
            }
            onTabChange();
            this.activeTab = tabName;
        });
        this.tabGroup.addEventListener('sl-tab-hide', (event) => {
            const tabName = event.detail.name;
            if (this.eventFunctions.has(tabName)) {
                const { onSel, onDeSel } = this.eventFunctions.get(tabName);
                onDeSel();
            }
        });
    }
    addTab(label, iconName) {
        const tabPanel = document.createElement('sl-tab-panel');
        tabPanel.name = label;
        tabPanel.classList.add('tab-panel');
        const tab = document.createElement('sl-tab');
        tab.slot = 'nav';
        tab.panel = label;
        const icon = document.createElement('sl-icon');
        icon.library = 'lucide';
        icon.name = iconName;
        icon.style.fontSize = '1.3em';
        tab.appendChild(icon);
        this.tabGroup.appendChild(tab);
        this.tabGroup.appendChild(tabPanel);
        const laceTab = new LaceTab(tabPanel, this.lace, this.changed.bind(this), (onSel, onDeSel) => this.registerEventFunctions(label, onSel, onDeSel), this.vertical);
        this.laceTabs.set(label, laceTab);
        this.tabs.push({ name: label, tabPanel: tabPanel, tab: tab });
        return laceTab;
    }
    registerEventFunctions(name, onSel, onDeSel) {
        this.eventFunctions.set(name, { onSel, onDeSel });
    }
    show(label) {
        this.tabGroup.show(label);
    }
    getActiveTab() {
        return this.activeTab;
    }
    getObj() { return null; }
    getKeys() { return []; }
    update() {
        this.laceTabs.forEach(tab => tab.update());
    }
    setSize(size) { }
}
class LaceTab {
    tabPanel;
    lace;
    onChange;
    container;
    elements = [];
    brs = new Map();
    onSelected = null;
    onDeSelected = null;
    constructor(tabPanel, lace, onChange, register, vertical) {
        const div = document.createElement('div');
        if (vertical)
            div.style.paddingLeft = '0.5em';
        else
            div.style.paddingTop = '0.5em';
        div.style.height = '100%';
        div.style.color = 'var(--sl-input-color) !important';
        tabPanel.appendChild(div);
        this.tabPanel = tabPanel;
        this.lace = lace;
        this.onChange = onChange;
        this.container = div;
        register(this.select.bind(this), this.deselect.bind(this));
    }
    select() {
        if (this.onSelected)
            this.onSelected();
    }
    deselect() {
        if (this.onDeSelected)
            this.onDeSelected();
    }
    registerOnSelected(callback) {
        this.onSelected = callback;
    }
    registerOnDeSelected(callback) {
        this.onDeSelected = callback;
    }
    add(element) {
        element.setSize('small');
        this.lace.connect(element);
        element.registerUpdateCallback(() => { this.onChange(); });
        if (this.elements.length > 0) {
            const br = document.createElement('br');
            this.brs.set(element, br);
            this.container.appendChild(br);
        }
        this.elements.push(element);
        this.container.appendChild(element.element);
    }
    addFolder(label, options = {}) {
        const folder = new FolderElement(label, this.lace, options);
        this.add(folder);
        return folder;
    }
    addGroup(options = {}) {
        const group = new GroupElement(this.lace, options);
        this.add(group);
        return group;
    }
    hide(element) {
        if (!this.elements.includes(element))
            return;
        if (element.element.dataset.display === undefined)
            element.element.dataset.display = element.element.style.display;
        element.element.style.display = 'none';
        const br = this.brs.get(element);
        if (br)
            br.style.display = 'none';
    }
    show(element) {
        if (!this.elements.includes(element))
            return;
        element.element.style.display = element.element.dataset.display || '';
        const br = this.brs.get(element);
        if (br)
            br.style.display = '';
    }
    update() {
        this.elements.forEach(element => element.update());
    }
}

export { LaceTab, TabElement };
