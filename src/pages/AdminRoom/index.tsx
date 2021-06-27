import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';

// import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';

import '../../styles/rooms.scss';
import { Question } from '../../components/Question/index.';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom(){
  // const {user} = useAuth();

  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const {questions,title} =useRoom(roomId);

  async function handleRemoveQuestion(questionId:string) {
    if(window.confirm('Tem certeza que você desja excluir esta pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    
    history.push('/');
  }

  async function handleCheckQuestion(questionId:string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleMarkQuestion(questionId:string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted:true
    })
  }


  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo de letmeask"/>
          <div>
            <RoomCode code={params.id}/>
            <Button 
              isOutlined
              onClick={() => {handleEndRoom()}}  
            >Encerrar sala</Button>
          </div>
          
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        
        <div className="question-list">
          {questions.map(question => {
           return (
            <Question
               key={question.id}
               content={question.content}
               author={question.author}
               isAnswered={question.isAnswered}
               isHighLighted={question.isHighLighted}
            >
              {!question.isAnswered && (
                <>
                   <button
                    type="button"
                    onClick={() => handleCheckQuestion(question.id)}
                  >
                   <img src={checkImg} alt="Marcar pergunta como respondida" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Destacar pergunta" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => handleRemoveQuestion(question.id)}
              >
                <img src={deleteImg} alt="Deletar pergunta" />
              </button>
            </Question>
           )
         })}
        </div>
        
      </main>
    </div>
  )
}