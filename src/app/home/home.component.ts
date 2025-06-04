import { Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessageService } from "../messages/messages.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  standalone: false,
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(
    private courseService: CoursesService,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.onReloadCourse();
  }

  onReloadCourse() {
    const courses$ = this.courseService
      .loadAllCourses()
      .pipe(map((courses) => courses.sort(sortCoursesBySeqNo)),
    catchError(err => {
      const message = "Could not load courses";
      this.messageService.showErrors(message)
      console.log(message, err)
      return throwError(err)
    }));
    const loadCourse$ = this.loadingService.showLoaderUntilComplete(courses$);
    this.beginnerCourses$ = loadCourse$.pipe(
      map((courses) =>
        courses.filter((course) => course.category == "BEGINNER")
      )
    );
    this.advancedCourses$ = loadCourse$.pipe(
      map((courses) =>
        courses.filter((course) => course.category == "ADVANCED")
      )
    );
  }
}
