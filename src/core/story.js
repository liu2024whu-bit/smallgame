import { SCENE_BY_ID } from '../data/scenes.js';

export function storyPosition(state){
  const chapter=state.ending?'愿望收好啦':state.usedTools.includes('birthday-door')?'门后的生日':state.solved.includes('stitch')?'合上的画册':'散着的几页';
  return {chapter,place:SCENE_BY_ID[state.scene].title};
}
