// Представьте себе ситуацию: у нас есть группа студентов, и мы хотим отследить,
//   кто из них посетил какие уроки и кто из преподавателей вёл данные уроки.
// 1. Map будет использоваться для хранения соответствия между уроком и
// преподавателем.
// 2. Set будет использоваться для хранения уникальных уроков, которые
// посетил каждый студент.

const lessonsTeachers = new Map();
lessonsTeachers.set('Math', 'Mr. Smith');
lessonsTeachers.set('Science', 'Mrs. Johnson');
lessonsTeachers.set('History', 'Mr. Brown');
lessonsTeachers.set('Art', 'Ms. Davis');

const studentsLessons = new Map();

studentsLessons.set('Alice', new Set(['Math', 'Science']));
studentsLessons.set('Bob', new Set(['Math', 'History']));
studentsLessons.set('Charlie', new Set(['Science', 'Art']));
studentsLessons.set('Diana', new Set(['Math', 'Science', 'History', 'Art']));

function addLesson(student, lesson) {
  if (!studentsLessons.has(student)) {
    studentsLessons.set(student, new Set());
  }
  studentsLessons.get(student).add(lesson);
}

function getTeacherByLesson(lesson) {
  return lessonsTeachers.get(lesson);
}

addLesson('Alice', 'History');
console.log('Lessons visited by Alice:', studentsLessons.get('Alice'));

const lesson = 'Math';
const teacher = getTeacherByLesson(lesson);
console.log(`The teacher for the ${lesson} lesson is ${teacher}.`);

studentsLessons.forEach((lessons, student) => {
  console.log(`${student} visited: ${Array.from(lessons).join(', ')}`);
});

lessonsTeachers.forEach((teacher, lesson) => {
  console.log(`Lesson: ${lesson}, Teacher: ${teacher}`);
});