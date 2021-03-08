<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-height full-width">
      <div class="q-py-lg q-px-lg row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            class="new_tweet"
            bottom-slots
            v-model="newTweetContent"
            placeholder="What's Happening?"
            counter
            maxlength="280"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.onlinewebfonts.com/svg/img_299586.png" />
              </q-avatar>
            </template>

            <template v-slot:after> </template>
          </q-input>
        </div>

        <div class="col col-shrink">
          <q-btn
            @click="addNewTweet"
            class="q-mb-lg"
            unelevated
            rounded
            color="primary"
            label="Tweet"
            :disable="!newTweetContent"
            no-caps
          />
        </div>
      </div>
      <q-separator class="divider" size="10px" color="grey-2" />

      <div class="q-pa-md q-gutter-md">
        <q-list separator>
          <transition-group
            appear
            enter-active-class="animated fadeIn slow"
            leave-active-class="animated fadeOut"
          >
            <q-item
              v-for="tweet in tweets"
              :key="tweet.id"
              class="q-py-md tweet"
            >
              <q-item-section avatar top>
                <q-avatar size="xl">
                  <img
                    src="https://cdn.onlinewebfonts.com/svg/img_299586.png"
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1"
                  ><strong>Aditya Tajanpure </strong>
                  <span class="text-grey-7"
                    >@aditya_tajanpure <br class="lt-md" />&bull;
                    {{ tweet.date | relativeDate }} ago</span
                  >
                </q-item-label>

                <q-item-label class="tweet_content text-body1"
                  >{{ tweet.content }}
                </q-item-label>
                <div class="tweet-icons row justify-between q-mt-sm">
                  <q-btn
                    flat
                    round
                    color="grey"
                    size="sm"
                    icon="far fa-comment"
                  />
                  <q-btn
                    flat
                    round
                    color="grey"
                    size="sm"
                    icon="fas fa-retweet"
                  />
                  <q-btn
                    flat
                    round
                    @click="toggleLike(tweet)"
                    :color="tweet.liked ? 'pink' : 'grey'"
                    size="sm"
                    :icon="tweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  />
                  <q-btn
                    flat
                    round
                    color="grey"
                    @click="deleteTweet(tweet)"
                    size="sm"
                    icon="fas fa-trash"
                  />
                </div>
              </q-item-section>
            </q-item>
          </transition-group>
        </q-list>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { formatDistance } from "date-fns";

import db from "src/boot/firebase";

export default {
  name: "PageHome",
  data() {
    return {
      newTweetContent: "",
      tweets: [
        // {
        //   id: "ID1",
        //   liked: false,
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio laboriosam aut magni adipisci dignissimos. Facilis nesciunt tempore rerum numquam sequi ipsum inventore expedita fuga veritatis vitae! Est explicabo rem sequi.",
        //   date: 1615100103192,
        // },
        // {
        //   id: "ID2",
        //   liked: true,
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio laboriosam aut magni adipisci dignissimos. Facilis nesciunt tempore rerum numquam sequi ipsum inventore expedita fuga veritatis vitae! Est explicabo rem sequi.",
        //   date: 1615100103444,
        // },
      ],
    };
  },
  methods: {
    addNewTweet() {
      let newTweet = {
        content: this.newTweetContent,
        date: Date.now(),
        liked: false,
      };
      this.newTweetContent = "";
      // this.tweets.unshift(newTweet);
      db.collection("quotes")
        .add(newTweet)
        .then(function (docRef) {
          console.log("Document created with id ", docRef.id);
        })
        .catch(function (error) {
          console.log("Error adding document", error);
        });
    },
    toggleLike(tweet) {
      db.collection("quotes")
        .doc(tweet.id)
        .update({
          liked: !tweet.liked,
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    },
    deleteTweet(tweet) {
      db.collection("quotes")
        .doc(tweet.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
  },
  mounted() {
    db.collection("quotes")
      .orderBy("date")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let quotes = change.doc.data();
          quotes.id = change.doc.id;
          if (change.type === "added") {
            console.log("New quote: ", quotes);
            this.tweets.unshift(quotes);
          }
          if (change.type === "modified") {
            console.log("Modified quote: ", quotes);
            let index = this.tweets.findIndex((tweet) => tweet.id == quotes.id);
            Object.assign(this.tweets[index], quotes);
          }
          if (change.type === "removed") {
            console.log("Removed quote: ", quotes);
            let index = this.tweets.findIndex((tweet) => tweet.id == quotes.id);
            this.tweets.splice(index, 1);
          }
        });
      });
  },
};
</script>

<style lang="sass">
.new_tweet
  textarea
    font-size: 19px
    line-height: 1.4 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.tweet_content
  white-space: pre-line

.tweet-icons
  margin-left: -5px

.tweet:not(:first-child)
  border-top: 1px solid rgba(0,0,0,0.12)
</style>
