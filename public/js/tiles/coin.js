

function handle({entity, match,resolver}) {
    if (entity.player){
        entity.player.addCoins(1);
        const coin = resolver.matrix;
        coin.delete(match.indexX,match.indexY);
    }
}

export const coin = [handle, handle];