import {Component, ElementRef, Renderer} from '@angular/core';
import {AppState} from '../../app.service';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_CARD_DIRECTIVES, MdCard, MdCardHeader, MdCardTitleGroup} from '@angular2-material/card';
import {MD_INPUT_DIRECTIVES, MdInput} from '@angular2-material/input';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
// import '@angular2-material/radio';
// import '@angular2-material/progress-bar';
// import '@angular2-material/progress-circle';
// import {MdCheckbox} from '@angular2-material/checkbox';

declare var twttr;

const description = `
ng-conf is a three day, single track conference focused on delivering the 
highest quality training in the Angular JavaScript framework. Developers from across the country 
will converge on beautiful Salt Lake City, UT to participate in training sessions by the Google 
Angular team, and other Angular experts. In addition to the invaluable training, ng-conf will 
deliver a premier conference experience for attendees, providing opportunities to network with 
other developers, relax at social events, and engage in some of the unique 
entertainment opportunities available in Utah.
`;

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'live-stream'
  selector: 'live-stream',  // <live-stream></live-stream>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  viewProviders: [MdIconRegistry],
  // We need to tell Angular's compiler which directives are in our template.
  // Doing so will allow Angular to attach our behavior to an element
  directives: [
    MD_INPUT_DIRECTIVES,
    MD_LIST_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES,
    MD_CARD_DIRECTIVES,
    MdToolbar,
    MdButton,
    MdInput,
    MdIcon,
    MdCard,
    MdCardHeader,
    MdCardTitleGroup
  ],
  // We need to tell Angular's compiler which custom pipes are in our template.
  pipes: [],

  // Our list of styles in our component. We may add more to compose many styles together
  styles: [require('./live-stream.css')],

  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  template: require('./live-stream.view.html')
})

export class LiveStream {
  // Set our default values
  localState = {
    streams: <any>[],
    currentStream: {},
    playerSizes: <any>[],
    musicPlaylists: <any>[],
    twitterTimelines: <any>[],
    currentPlaylist: {},
    timelineEl: <any>{},
    playerWidth: 560,
    playerHeight: 315,
    autoPlay: 0
  };

  // TypeScript public modifiers
  constructor(public appState:AppState, mdIconRegistry:MdIconRegistry) {
    mdIconRegistry
      .addSvgIcon('thumb-up', '/demo-app/icon/assets/thumbup-icon.svg')
      .addSvgIconSetInNamespace('core', '/demo-app/icon/assets/core-icon-set.svg');

    this.localState.streams = [
      {
        id: 'mAjjI35RcUE',
        name: 'ng-conf 2016 Conference Day 1',
        icon: 'event',
        description: description,
        dateTime: new Date(2016, 6, 4, 0, 0, 0)
      }, {
        id: 'bSssb9AmiJU',
        name: 'ng-conf 2016 Conference Day 2',
        icon: 'event',
        description: description,
        dateTime: new Date(2016, 6, 5, 0, 0, 0)
      }, {
        id: '_ubji2Y1ysY',
        name: 'ng-conf 2016 Newsroom',
        icon: 'event',
        description: description,
        dateTime: new Date(2016, 6, 5, 0, 0, 0)
      }, {
        id: 'Bb-IfZcNxYQ',
        name: 'NG Conf Robot Battles',
        icon: 'android',
        description: description,
        dateTime: new Date(2016, 6, 5, 0, 0, 0)
      }, {
        id: 'kJ6LVmQ6z0M',
        name: 'ng-conf 2016 Conference Day 3',
        icon: 'event',
        description: description,
        dateTime: new Date(2016, 6, 6, 0, 0, 0)
      }
    ];

    this.localState.playerSizes = [
      {id: 'small', width: 560, height: 315},
      {id: 'medium', width: 640, height: 360},
      {id: 'large', width: 853, height: 480},
      {id: 'xlarge', width: 1280, height: 720},
      {id: 'full', width: '100%', height: 720}
    ];


    this.localState.musicPlaylists = [
      {
        id: '221769097%3Fsecret_token%3Ds-epau5',
        name: 'morning',
        url: this._createSoundcloudUrl('221769097%3Fsecret_token%3Ds-epau5')
      }, {
        id: '221769024',
        name: 'afternoon',
        url: this._createSoundcloudUrl('221769024')
      }, {
        id: '1',
        name: 'spotify test',
        url: ['https://embed.spotify.com/?uri=',
          'spotify:user:ruzz311:playlist:0zNFEjsiKRTkD2n7EmspWb',
          '&theme=white&view=coverart'].join('')
      }
    ];

    this.localState.twitterTimelines = [
      {
        id: '728305137790263297',
        description: '#ngconf',
        related: 'twitterdev,twitterapi'
      }
    ];

    this.localState.currentPlaylist = this.localState.musicPlaylists[2];
    this.localState.currentStream = this.localState.streams[0];

    this.setPlayerSize(4);
  }

  ngOnInit() {
    console.log('hello `live-stream` component');
    // this.title.getData().subscribe(data => this.data = data);
  }

  ngAfterViewInit() {
    window.addEventListener('resize', this.onResize.bind(this));
    this.setTwitterTimeline(this.localState.twitterTimelines[0]);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }

  setTwitterTimeline(timelineWidget) {
    try {
      let element = document.getElementById('twitter-search-widget');
      let options = {
        width: '100%',
        height: 'inherit',
        related: timelineWidget.related || 'twitterdev,twitterapi',
        chrome: 'nofooter, noborders' // 'noheader, nofooter, noborders, transparent, noscrollbar'
      };

      // empty widget container
      element.innerHTML = '';

      twttr.widgets.createTimeline(timelineWidget.id, element, options)
        .then((el)=> {
          console.log('Embedded a timeline for ' + timelineWidget.id);
          this.localState.timelineEl = el;
          this.onResize();
        });
    } catch (e) {
      console.log(e);
    }
  }

  setPlayerSize(index) {
    this.localState.playerWidth = this.localState.playerSizes[index].width;
    this.localState.playerHeight = this.localState.playerSizes[index].height;
  }

  setCurrentStream (evnt, stream) {
    evnt.preventDefault();
    this.localState.autoPlay = 1;
    this.localState.currentStream = stream;
  }

  onChange(newValue) {
    console.log(newValue);
    let playlists = this.localState.musicPlaylists;
    let found = playlists.filter((row) => row.id === newValue)[0];
    if (found.length > 0) {
      this.localState.currentPlaylist = found[0];
    } else {
      this.localState.currentPlaylist = this.localState.musicPlaylists[0];
    }
    // this.localState.currentPlaylist = newValue;
    // ... do other stuff here ...
  }

  onResize() {
    let el = this.localState.timelineEl;
    if (!el) return;
    el.style.height = el.parentNode.clientHeight + 'px';
  }

  _createSoundcloudUrl(id) {
    let pre = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/';
    let post = [
      'color=ff5500',
      'auto_play=false',
      'hide_related=false',
      'show_comments=true',
      'show_user=true',
      'show_reposts=false'].join('&amp;');
    return pre + id + '&amp;' + post;
  }
}
