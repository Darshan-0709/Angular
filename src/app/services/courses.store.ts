import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MessageService } from "../messages/messages.service";
import { LoadingService } from "../loading/loading.service";

@Injectable({
  providedIn: "root",
})
export class CourseStore {
  subject$ = new BehaviorSubject<Course[]>([]);
  courses$ = this.subject$.asObservable();

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) {
    this.loadAllCourse();
  }

  filteredCourse(category: string) {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }

  private loadAllCourse() {
    const loadAllCourse$ = this.http.get<Course[]>("api/courses").pipe(
      map((response) => response["payload"]),
      catchError((err) => {
        const message = "Could not load courses";
        this.messageService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap((courses) => {
        this.subject$.next(courses);
      })
    );
    this.loadingService.showLoaderUntilComplete(loadAllCourse$).subscribe();
  }
}
