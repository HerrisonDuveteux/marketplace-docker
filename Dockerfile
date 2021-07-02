# ======================BUILD======================================

FROM node:latest as builder

WORKDIR /apps
COPY . .

RUN yarn install && yarn build:www


# ======================RUN========================================

FROM nginx:1.19

WORKDIR /usr/share/nginx/html

COPY env.sh .

COPY --from=builder /apps/packages/apps/build /usr/share/nginx/html

EXPOSE 80

ARG escrowAddress=default_value

ARG MatcherContractAddress=default_value

ARG mintedCollection=default_value

ARG vaultAddress=default_value


ENV escrowAddress $escrowAddress

ENV MatcherContractAddress $MatcherContractAddress

ENV mintedCollection $mintedCollection

ENV vaultAddress $vaultAddress


# RUN if [ "$escrowAddress" = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" ] ; then echo "production env"; else echo "non-production env: $escrowAddress"; fi


RUN chmod 777 /usr/share/nginx/html/env.sh

RUN /usr/share/nginx/html/env.sh

CMD ["nginx", "-g", "daemon off;"]