import { httpService } from 'services';
import { Api } from './http.service';
import { PollFront, PollQuestionType } from 'shared/interfaces/polls';

export const getOrganisationPolls = async (organisationId: number, is_closed?: number, is_active?: number): Promise<PollFront[]> => {
  const response = await httpService.axios.get(`${Api.POLLS}/${organisationId}/quizzes`, { params: { is_closed, is_active } });
  return response.data.data;
};

export const getPoll = async (organisationId: number, pollId?: number): Promise<PollFront> => {
  const response = await httpService.axios.get(`${Api.POLLS}/${organisationId}/quizzes/${pollId}`);
  return response.data.data;
};

export const showOrAnswerQuestion = async (
  organisationId: number,
  pollId: number,
  answer?: any
): Promise<{ data?: PollQuestionType; ok?: boolean; meta?: { current: number; total: number } }> => {
  const response = await httpService.axios.post(`${Api.POLLS}/${organisationId}/quizzes/${pollId}`, {
    answer: answer,
  });
  return response.data;
};
