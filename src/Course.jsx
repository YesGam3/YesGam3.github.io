function Course(props){
    const course = props.course
    const aList = course.parts.map(part => part.exercises)

    
    return(
    <>
      <h2>{course.name}</h2>
      <br></br>
      <div>
        <ul>
          {course.parts.map(part => <li key={part.id}>{part.name} {part.exercises}</li>)}
        </ul>
      <br></br>
      <h3>total of {aList.reduce((intialValue, currentValue) => intialValue + currentValue)} exercises</h3>  
      </div>
  
    </>
  )
};

function CourseDisplay(){ 
    const courses = [
    {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 12,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'ABC',
        exercises: 1,
        id: 4
      }
    ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  

  return (
    <div>
      <h2>Web development curriculum</h2>
      <Course course={courses[0]}></Course>
      <Course course={courses[1]}></Course>
    </div>
  )
}

export default CourseDisplay