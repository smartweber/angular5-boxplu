import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import * as $ from 'jquery';
import 'slick-carousel/slick/slick';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html'
})

export class SelectBoxComponent implements OnInit, AfterViewInit {
  @Input() data: any;               //The input data
  id: string;                       //The ID of the carousel in the DOM
  label: string;
  openBox: boolean;
  elementHeight: number;
  selected: any;
  callback: any;

  constructor() {
  }

  ngAfterViewInit() {
    this.id = '#select-box-' + this.data.playlist.id;
  }

  ngOnInit() {

  }

  // vm.data = $scope.data;
  // vm.callback = $scope.callback;
  // vm.label = $scope.label;
  // vm.elementHeight = $scope.elementHeight || 46;
  // vm.selected = $scope.selected || (vm.data && vm.data[0]);
  // vm.openBox = false;

  // $rootScope.$on('documentClicked', function() {
  //   if (vm.openBox) {
  //     vm.openBox = false;
  //   }
  // });

  openSelectBox() {
    if (!this.openBox) {
      setTimeout(() => {
        this.openBox = true;
      }, 100);
    }
  }

  /**
   * Sets the clicked element as selected and invokes the callback function
   * @param el
   */
  select(el) {
    this.selected = el;
    if (this.callback) {
      this.callback(el);
    }
  }


}
